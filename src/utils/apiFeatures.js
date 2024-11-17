class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1. Filtering
    const queryObject = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObject[el]);

    //2. Advance Filtering
    /*
     * {difficulty:'easy', duration:{ $gte:5 }} //Query to be applied
     * {difficulty:'easy', duration:{ $gte:5 }} // Recived Query
     * gte, gt, lte, lt //these are the operators that we can recieve
     * We should write the documentation to let user know which operation is allowed or not.
     */
    let queryStr = JSON.stringify(queryObject);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`), // Regular expression to replace gte => $gte
    );
    /** */

    this.query.find(queryStr);
    return this;
  }

  sort() {
    //3. Sorting the items

    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy); // to sort in descending, include minus in query.
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  //4) Field limiting
  limit() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // minus means we are excluding the fields.
    }
    return this;
  }

  paginate() {
    //5) Pagination
    /**
     * page=5&limit=10
     * Skip: no of items to skip [40]
     * limit: no of items to pe send over.[10]
     */
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
