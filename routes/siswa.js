const express = require('express');
const mysql = require('mysql2');

const router = express.Router();

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_toko'
}).promise();


// GET SEMUA SISWA
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM siswa'
        );

        res.json({
            status: true,
            data: rows
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});


// GET SISWA BERDASARKAN ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const [rows] = await db.query(
            'SELECT * FROM siswa WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Siswa tidak ditemukan'
            });
        }

        res.json({
            status: true,
            data: rows[0]
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});


// POST TAMBAH SISWA
router.post('/', async (req, res) => {
    const {
        nis,
        nama,
        kelas,
        jurusan,
        alamat
    } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO siswa
            (nis, nama, kelas, jurusan, alamat)
            VALUES (?, ?, ?, ?, ?)`,
            [nis, nama, kelas, jurusan, alamat]
        );

        res.json({
            status: true,
            message: 'Siswa berhasil ditambahkan',
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});


// PUT EDIT SISWA
router.put('/:id', async (req, res) => {
    const id = req.params.id;

    const {
        nis,
        nama,
        kelas,
        jurusan,
        alamat
    } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE siswa
            SET nis = ?,
                nama = ?,
                kelas = ?,
                jurusan = ?,
                alamat = ?
            WHERE id = ?`,
            [nis, nama, kelas, jurusan, alamat, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: 'Siswa tidak ditemukan'
            });
        }

        res.json({
            status: true,
            message: 'Data siswa berhasil diubah'
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const [result] = await db.query(
            'DELETE FROM siswa WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: 'Siswa tidak ditemukan'
            });
        }

        res.json({
            status: true,
            message: 'Siswa berhasil dihapus'
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});


module.exports = router;