export const schemaOptions = {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;

      if (ret.textSearch) delete ret.textSearch;
    },
  },
};

export const format = (documents) => {
  if (Array.isArray(documents)) {
    return documents.map((doc) => {
      doc.id = doc._id;
      delete doc._id;
      delete doc.__v;
      return doc;
    });
  }

  documents.id = documents._id;
  delete documents._id;
  delete documents.__v;
  return documents;
};
