const { get } = require('mongoose');
const csv = require('csv-parser');
const stream = require('stream');
const studentModel = require('../models/StudentsModel');
const vaccineModal = require('../models/VaccineModal');

addStudent = async (req, res) => {
    try {
        const { name, className, ID } = req.body;
        const studentExists = await studentModel.findOne({ ID: ID });
        if (studentExists) {
            return res.status(409).json({
                message: 'Student Already Exists',
            })
        }
        // const vaccines = await vaccineModal.find();
        // const vaccinationStatus = vaccines.map(vaccine => ({
        //     vaccine: vaccine._id,
        //     status: false,
        // }));
        const student = await studentModel.create({
            name: name,
            class: className,
            ID: ID,
            vaccinationStatus: []
        });
        res.status(200).json({
            message: 'Student Added Successfully',
            data: student
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}
getStudents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit; 
        const students = await studentModel.find().populate({
            path: 'vaccinationStatus.vaccine',
            select: 'vaccineName vaccineId date -_id'
        }).skip(skip).limit(limit);
        const totalStudents = await studentModel.countDocuments();
        res.status(200).json({
            students,
            totalPages: Math.ceil(totalStudents / limit),
            currentPage: page,
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}
editStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, className } = req.body;
        const student = await studentModel.findOneAndUpdate({ ID: id }, {
            $set: {
                name: name,
                class: className,
            }
        });
        if (!student) {
            return res.status(404).json({
                message: 'Student Not Found',
            })
        }
        res.status(200).json({
            message: 'Student Edited Successfully',
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}
getStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await studentModel.findOne({ ID: id }).populate({
            path: 'vaccinationStatus.vaccine',
            select: 'vaccineName vaccineId date applicableClasses -_id'
        });
        if (!student) {
            return res.status(404).json({
                message: 'Student Not Found',
            })
        }
        res.status(200).json({
            message: 'Student Data Retrieved Successfully',
            data: student
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}
updateStudentsVaccinationStatus = async (req, res) => {
    try {
        const { studentId, vaccineId } = req.params;
        const { status } = req.body;
        const vaccine = await vaccineModal.findOne({ vaccineId: vaccineId });
        if (!vaccine) {
            return res.status(404).json({ message: 'Vaccine not found' });
        }
        const student = await studentModel.findOne({ ID: studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        if (student.vaccinationStatus.length == 0) {
            student.vaccinationStatus.push({
                vaccine: vaccine._id,
                status: status
            })
            await student.save();
        }
        else if (student.vaccinationStatus.length > 0) {
            const vaccineIndex = student.vaccinationStatus.findIndex(v => v.vaccine.toString() == vaccine._id.toString());
            if (vaccineIndex > -1) {
                student.vaccinationStatus[vaccineIndex].status = status;
            }
            else {
                student.vaccinationStatus.push({
                    vaccine: vaccine._id,
                    status: status
                })
            }
            await student.save();


            if (!student) {
                return res.status(404).json({
                    message: 'Student Not Found',
                })
            }

        }
        res.status(200).json({
            message: 'Vaccination Status Updated Successfully',
        })

    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}
deleteVaccinationRegistraion = async (req, res) => {
    try {
        const { studentId, vaccineId } = req.params;
        const student = await studentModel.findOne({ ID: studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const vaccine = await vaccineModal.findOne({ vaccineId: vaccineId });
        if (!vaccine) {
            return res.status(404).json({ message: 'Vaccine not found' });
        }
        const vaccineIndex = student.vaccinationStatus.findIndex(v => v.vaccine.toString() == vaccine._id.toString());
        if (vaccineIndex > -1) {
            student.vaccinationStatus.splice(vaccineIndex, 1);
            await student.save();
            return res.status(200).json({ message: 'Vaccination registration deleted successfully' });
        }
        else {
            return res.status(404).json({ message: 'Vaccine not found in student vaccination status' });
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}
const bulkUpload = async (req, res) => {
    try {
        const file = req.file; // Access the uploaded file
        if (!file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const students = [];
        const bufferStream = new stream.PassThrough();
        bufferStream.end(file.buffer); // Convert the buffer to a readable stream

        // Parse the CSV file
        bufferStream
            .pipe(csv())
            .on('data', (row) => {
                const sanitizedRow = {};
                for (const key in row) {
                    const sanitizedKey = key.replace(/^\uFEFF/, ''); // Remove BOM
                    sanitizedRow[sanitizedKey] = row[key];
                }
                students.push(sanitizedRow); // Add sanitized row to the students array
            })
            .on('end', async () => {
                if (students.length === 0) {
                    return res.status(400).json({ message: "Invalid or empty data provided." });
                }

                // Save students to the database
                const results = [];
                for (const studentData of students) {
                    const { name, ID, className } = studentData;

                    // Check if the student already exists
                    const existingStudent = await studentModel.findOne({ ID });
                    if (existingStudent) {
                        results.push({
                            ID,
                            status: "Skipped",
                            message: "Student already exists",
                        });
                        continue;
                    }

                    // Create a new student
                    const newStudent = new studentModel({
                        name,
                        ID,
                        class: className,
                    });

                    try {
                        await newStudent.save();
                        results.push({
                            ID,
                            status: "Success",
                            message: "Student added successfully",
                        });
                    } catch (err) {
                        results.push({
                            ID,
                            status: "Failed",
                            message: `Error saving student: ${err.message}`,
                        });
                    }
                }

                res.status(200).json({
                    message: "File processed successfully.",
                    results,
                });
            })
            .on('error', (err) => {
                res.status(500).json({ message: `Error processing file: ${err.message}` });
            });
    } catch (err) {
        res.status(500).json({
            message: `Error uploading students: ${err.message}`,
        });
    }
};
const deleteStudent=async (req, res) => {
    try {
        const { id } = req.params;
        const student = await studentModel.findOneAndDelete({ ID: id });
        res.status(200).json({
            message: 'Student Deleted Successfully',
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}

module.exports = { addStudent, getStudents, editStudent, getStudent, updateStudentsVaccinationStatus, deleteVaccinationRegistraion, bulkUpload,deleteStudent }