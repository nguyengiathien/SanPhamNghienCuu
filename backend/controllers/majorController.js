'use strict';

const db = require('../models');

exports.getAllMajors = async (req, res, next) => {
  try {
    const majors = await db.Major.findAll();
    res.json({ majors });
  } catch (err) {
    next(err);
  }
};

exports.getMajorById = async (req, res, next) => {
  try {
    const major = await db.Major.findByPk(req.params.id);
    if (!major) return res.status(404).json({ message: 'khong tim thay nganh' });
    res.json({ major });
  } catch (err) {
    next(err);
  }
};

exports.createMajor = async (req, res, next) => {
  try {
    const { majorName } = req.body;
    const major = await db.Major.create({ majorName });
    res.status(201).json({ message: 'tao nganh thanh cong', major });
  } catch (err) {
    next(err);
  }
};

exports.updateMajor = async (req, res, next) => {
  try {
    const { majorName } = req.body;
    const major = await db.Major.findByPk(req.params.id);
    if (!major) return res.status(404).json({ message: 'khong tim thay nganh' });

    await major.update({ majorName });
    res.json({ message: 'cap nhat thanh cong', major });
  } catch (err) {
    next(err);
  }
};

exports.deleteMajor = async (req, res, next) => {
  try {
    const major = await db.Major.findByPk(req.params.id);
    if (!major) return res.status(404).json({ message: 'khong tim thay nganh' });

    await major.destroy();
    res.json({ message: 'xoa thanh cong' });
  } catch (err) {
    next(err);
  }
};
