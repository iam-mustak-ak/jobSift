import mongoose from "mongoose";

const connnectMongo = async (dbUri: string) => {
    try {
        const options = {
            dbName: "jobsift",
        };
        await mongoose.connect(dbUri, options);
        console.log("Database connection Successfull");
    } catch (e) {
        console.log(e);
    }
};

export default connnectMongo;
