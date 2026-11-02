
import mongoose from "mongoose";

const feedSchema = new mongoose.Schema({

    studentName: {
        type: String,
        required: true
    },

    studentCourse: {
        type: String,
        required: true
    },

    message: {
        type: String
    },

    rating: {
        type: Number
    },

    review:{
        type:String
    }

});

const feedbackModel = mongoose.model("Feedback", feedSchema);

export default feedbackModel;
