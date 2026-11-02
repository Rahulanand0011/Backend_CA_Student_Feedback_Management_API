
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import feedbackModel from './model/feedback.js';

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://rajatmaurya176_db_user:asdfghjkl@cluster0.uq8mwqu.mongodb.net/TaskManagement")
    .then(() => {
        console.log("MongoDB connected 🚀");
    })
    .catch((err) => {
        console.log("Database connection faled:", err);
    });


app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend API is running 🚀"
    });
});


app.post('/api/feedback', async (req, res) => {
    try {
        const { studentName, courseName, message, rating } = req.body;

        if (!studentName || !courseName || !message || rating === undefined || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "required FIeld is Missing"
            });
        }

        await feedbackModel.create({
            studentName,
            studentCourse: courseName,
            message,
            rating
        });

        return res.status(201).json({
            success: true,
            message: "Feedback received"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while saving feedback"
        });
    }
});



app.get('/api/feedback', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;

        const skip = (page - 1) * limit;

        const data = await feedbackModel
            .find()
            .skip(skip)
            .limit(limit);

        const count = await feedbackModel.countDocuments();

        return res.status(200).json({
            success: true,
            metadata: {
                records: data,
                currpage: page,
                totalrecords: count,
                totalpages: Math.ceil(count / limit)
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "error occured Try agan later"
        });
    }
});



app.patch('/api/feedback/:id', async (req, res) => {
    try {
        //6ae83194cda79f95186b60c0
        const id = req.params.id;
        const status = req.body.status;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ObjectId"
            });
        }

        const updatedFeedback = await feedbackModel.findByIdAndUpdate(
            id,
            { review: status },
            { new: true }
        );
        if (!updatedFeedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Feedback updated successfully",
            data: updatedFeedback
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Error occurred while updating feedback: ${err}`
        });
    }
});

app.listen(2000, () => {
    console.log("Server running on port 2000 ✅");
});




// // MONGO_URI="mongodb+srv://rajatmaurya176_db_user:asdfghjkl@cluster0.uq8mwqu.mongodb.net/TaskManagement"
// http://localhost:5000
