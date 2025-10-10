export const generateImageUrl = (
  studentId: string,
  category: 'profile' | 'arts' | 'news',
  filename: string,
): string => {
  return `${process.env.BASE_URL}/uploads/${studentId}/${category}/${filename}`;
};
