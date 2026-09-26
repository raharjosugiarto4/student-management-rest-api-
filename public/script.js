const API = 'http://localhost:3000/api/siswa';

const form = document.getElementById('formSiswa');
const dataSiswa = document.getElementById('dataSiswa');
const loading = document.getElementById('loading');
const message = document.getElementById('message');

let semuaSiswa = [];


// ==========================
// GET DATA SISWA
// ==========================

async function loadSiswa() {

    loading.style.display = 'block';

    try {

        const response = await fetch(API);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        semuaSiswa = result.data;

        tampilkanSiswa(semuaSiswa);

        isiFilterKelas(semuaSiswa);

    } catch (error) {

        showMessage(error.message, 'error');

    } finally {

        loading.style.display = 'none';

    }
}


// ==========================
// TAMPIL DATA
// ==========================

function tampilkanSiswa(data) {

    dataSiswa.innerHTML = '';

    document.getElementById('jumlahSiswa').textContent =
        data.length;

    if (data.length === 0) {

        dataSiswa.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center">
                    Data siswa tidak ditemukan
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(siswa => {

        dataSiswa.innerHTML += `
            <tr>

                <td>${siswa.id}</td>

                <td>${siswa.nis}</td>

                <td>${siswa.nama}</td>

                <td>${siswa.kelas}</td>

                <td>${siswa.jurusan}</td>

                <td>${siswa.alamat}</td>

                <td>

                    <button
                        class="btn-edit"
                        onclick="editSiswa(${siswa.id})"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        class="btn-delete"
                        onclick="hapusSiswa(${siswa.id})"
                    >
                        🗑️ Hapus
                    </button>

                </td>

            </tr>
        `;

    });

}


// ==========================
// FILTER KELAS
// ==========================

function isiFilterKelas(data) {

    const filter =
        document.getElementById('filterKelas');

    const kelas = [
        ...new Set(
            data.map(siswa => siswa.kelas)
        )
    ];

    filter.innerHTML =
        '<option value="">Semua Kelas</option>';

    kelas.forEach(k => {

        filter.innerHTML += `
            <option value="${k}">
                ${k}
            </option>
        `;

    });

}


// ==========================
// SEARCH + FILTER
// ==========================

function filterData() {

    const search =
        document.getElementById('search')
        .value
        .toLowerCase();

    const kelas =
        document.getElementById('filterKelas')
        .value;


    const hasil = semuaSiswa.filter(siswa => {

        const cocokSearch =
            siswa.nama.toLowerCase().includes(search) ||
            siswa.nis.toLowerCase().includes(search);

        const cocokKelas =
            kelas === '' ||
            siswa.kelas === kelas;

        return cocokSearch && cocokKelas;

    });


    tampilkanSiswa(hasil);
}


// ==========================
// POST / PUT
// ==========================

form.addEventListener('submit', async function(event) {

    event.preventDefault();

    const id =
        document.getElementById('id').value;

    const nis =
        document.getElementById('nis').value.trim();

    const nama =
        document.getElementById('nama').value.trim();

    const kelas =
        document.getElementById('kelas').value.trim();

    const jurusan =
        document.getElementById('jurusan').value.trim();

    const alamat =
        document.getElementById('alamat').value.trim();


    // VALIDASI

    if (!nis || !nama || !kelas || !jurusan || !alamat) {

        showMessage(
            'Semua data wajib diisi!',
            'error'
        );

        return;
    }


    const data = {
        nis,
        nama,
        kelas,
        jurusan,
        alamat
    };


    try {

        let response;


        if (id) {

            // PUT

            response = await fetch(`${API}/${id}`, {

                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(data)

            });

        } else {

            // POST

            response = await fetch(API, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(data)

            });

        }


        const result = await response.json();


        if (!response.ok) {

            throw new Error(result.message);

        }


        showMessage(
            result.message,
            'success'
        );


        resetForm();

        loadSiswa();


    } catch (error) {

        showMessage(
            error.message,
            'error'
        );

    }

});


// ==========================
// EDIT
// ==========================

async function editSiswa(id) {

    try {

        const response =
            await fetch(`${API}/${id}`);

        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(result.message);

        }


        const siswa = result.data;


        document.getElementById('id').value =
            siswa.id;

        document.getElementById('nis').value =
            siswa.nis;

        document.getElementById('nama').value =
            siswa.nama;

        document.getElementById('kelas').value =
            siswa.kelas;

        document.getElementById('jurusan').value =
            siswa.jurusan;

        document.getElementById('alamat').value =
            siswa.alamat;


        document.getElementById('formTitle').textContent =
            'Edit Siswa';


        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });


    } catch (error) {

        showMessage(
            error.message,
            'error'
        );

    }

}


// ==========================
// DELETE
// ==========================

async function hapusSiswa(id) {

    const yakin = confirm(
        'Apakah kamu yakin ingin menghapus siswa ini?'
    );


    if (!yakin) {
        return;
    }


    try {

        const response =
            await fetch(`${API}/${id}`, {

                method: 'DELETE'

            });


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(result.message);

        }


        showMessage(
            result.message,
            'success'
        );


        loadSiswa();


    } catch (error) {

        showMessage(
            error.message,
            'error'
        );

    }

}


// ==========================
// RESET FORM
// ==========================

function resetForm() {

    form.reset();

    document.getElementById('id').value = '';

    document.getElementById('formTitle').textContent =
        'Tambah Siswa';

}


// ==========================
// PESAN
// ==========================

function showMessage(text, type) {

    message.innerHTML = `
        <div class="${type}">
            ${text}
        </div>
    `;


    setTimeout(() => {

        message.innerHTML = '';

    }, 3000);

}


// ==========================
// DARK MODE
// ==========================

document
    .getElementById('darkMode')
    .addEventListener('click', function() {

        document.body.classList.toggle('dark');

        if (
            document.body.classList.contains('dark')
        ) {

            this.textContent = '☀️ Light Mode';

        } else {

            this.textContent = '🌙 Dark Mode';

        }

    });


// ==========================
// LOAD DATA SAAT HALAMAN
// DIBUKA
// ==========================

loadSiswa();