import { deleteFromCloudinary } from "../config/cloudinary";

export const cleanupRemovedMedia = async (
  oldContent: any[],
  newContent: any[]
) => {
  if (!Array.isArray(oldContent) || !Array.isArray(newContent)) {
    return;
  }

  for (const oldQuestion of oldContent) {
    if (oldQuestion?.type !== "listening") continue;

    const updatedQuestion = newContent.find(
      (q: any) =>
        q._id?.toString() === oldQuestion._id?.toString()
    );

    // deleted question
    if (!updatedQuestion) {
      if (oldQuestion?.file?.public_id) {
        await deleteFromCloudinary(
          oldQuestion.file.public_id,
          oldQuestion.file.resource_type
        );
      }
      continue;
    }

    // replaced file
    if (
      oldQuestion?.file?.public_id &&
      updatedQuestion?.file?.public_id &&
      oldQuestion.file.public_id !==
        updatedQuestion.file.public_id
    ) {
      await deleteFromCloudinary(
        oldQuestion.file.public_id,
        oldQuestion.file.resource_type
      );
    }
  }
};