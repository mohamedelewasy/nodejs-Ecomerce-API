class ApiFeature {
  constructor(mongoQuery, queryString) {
    this.mongoQuery = mongoQuery;
    this.queryString = queryString;
  }

  filter() {
    let f = {};
    if (this.queryString.price) {
      f["price"] = {
        $lte: this.queryString.price.lte || Math.pow(10, 6),
        $gte: this.queryString.price.gte || 1,
      };
    }
    if (this.queryString.rate) {
      f["rate"] = {
        $lte: this.queryString.rate.lte || 5,
        $gte: this.queryString.rate.gte || 1,
      };
    }
    this.mongoQuery.find(f);
    return this;
  }

  sort() {
    if (this.queryString.sort)
      this.mongoQuery.sort(this.queryString.sort.split(",").join(" "));
    else this.mongoQuery.sort("-createdAt");
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      this.mongoQuery.select(this.queryString.fields.split(",").join(" "));
    }
    return this;
  }

  paginate() {
    let page = this.queryString.page || 1;
    let limit = this.queryString.limit || 5;
    let skip = (page - 1) * limit;
    this.mongoQuery.skip(skip).limit(limit);
    this.currentPage = page;
    return this;
  }

  searchByKeyword(modelName = "") {
    if (!this.queryString.keyword) return this;
    let arrayOfSearchColumns = [];
    if (modelName.toLowerCase() == "product")
      arrayOfSearchColumns.push(
        { title: { $regex: this.queryString.keyword, $options: "i" } },
        { description: { $regex: this.queryString.keyword, $options: "i" } }
      );
    else
      arrayOfSearchColumns.push({
        name: { $regex: this.queryString.keyword, $options: "i" },
      });
    this.mongoQuery.find({
      $or: arrayOfSearchColumns,
    });

    return this;
  }
}

module.exports = ApiFeature;
