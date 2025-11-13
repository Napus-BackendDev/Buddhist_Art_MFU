const generateImageUrl = (studentId, type, filename) => {
  if (type === "news") {
    return `${process.env.BASE_FRONTEND_URL}/uploads/Admin/${type}/${filename}`;
  }
  return `${process.env.BASE_FRONTEND_URL}/uploads/${studentId}/${type}/${filename}`;
}

export default generateImageUrl;
