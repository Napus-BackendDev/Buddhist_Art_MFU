const normalizeMapFields = (body, fields = []) => {
  fields.forEach((field) => {
    if (body[field]) {
      body[field] = { ...body[field] };
    }
  });
};

export default normalizeMapFields;