import mongoose, { Schema } from "mongoose";
import Inc from "mongoose-sequence";

const AutoIncrement = Inc(mongoose);

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

noteSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "ticket_seq",
  start_seq: 500,
});

export default mongoose.model("Note", noteSchema);
