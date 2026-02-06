const { readCollection, writeCollection, matchesFilter, projectFields } = require('./fileStore');

function objectId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function now() {
  return new Date().toISOString();
}

function makeCollection(name, { uniqueEmail = true } = {}) {
  return {
    async findOne(filter) {
      const items = await readCollection(name);
      return items.find((it) => matchesFilter(it, filter)) || null;
    },
    async create(doc) {
      const items = await readCollection(name);
      if (uniqueEmail && doc.email && items.some((it) => it.email === doc.email)) {
        const err = new Error('Duplicate key');
        err.code = 11000;
        throw err;
      }
      const toInsert = { ...doc, _id: objectId(), createdAt: now(), updatedAt: now() };
      items.push(toInsert);
      await writeCollection(name, items);
      return toInsert;
    },
    async find(filter = {}) {
      const items = await readCollection(name);
      return items.filter((it) => matchesFilter(it, filter));
    },
    async findOneAndUpdate(filter, update, options = {}) {
      const items = await readCollection(name);
      const idx = items.findIndex((it) => matchesFilter(it, filter));
      if (idx === -1) return null;
      const target = { ...items[idx] };
      if (update && update.$set) {
        Object.assign(target, update.$set);
      } else if (update) {
        Object.assign(target, update);
      }
      target.updatedAt = now();
      items[idx] = target;
      await writeCollection(name, items);
      return options.lean ? { ...target } : target;
    },
    async findById(id) {
      const items = await readCollection(name);
      return items.find((it) => it._id === id) || null;
    },
    async findByIdAndUpdate(id, update, options = {}) {
      const items = await readCollection(name);
      const idx = items.findIndex((it) => it._id === id);
      if (idx === -1) return null;
      const target = { ...items[idx] };
      Object.assign(target, update);
      target.updatedAt = now();
      items[idx] = target;
      await writeCollection(name, items);
      return options.select ? projectFields(target, options.select) : target;
    },
  };
}

// Student and Recruiter
const Student = {
  ...makeCollection('students'),
  async findOne(filter) {
    const doc = await makeCollection('students').findOne(filter);
    return doc ? { ...doc, userType: 'student' } : null;
  },
};

const Recruiter = {
  ...makeCollection('recruiters'),
  async findOne(filter) {
    const doc = await makeCollection('recruiters').findOne(filter);
    return doc ? { ...doc, userType: 'recruiter' } : null;
  },
};

// Applications
const ApplicationsBase = makeCollection('applications');

const Application = {
  async findOne(filter) {
    return (await ApplicationsBase.find(filter))[0] || null;
  },
  async find(filter) {
    return ApplicationsBase.find(filter);
  },
  async findById(id) {
    return ApplicationsBase.findById(id);
  },
  async findByIdAndUpdate(id, update, opts) {
    return ApplicationsBase.findByIdAndUpdate(id, update, opts);
  },
  async create(doc) {
    return ApplicationsBase.create(doc);
  },
  async save(instance) {
    // not used; compatibility stub
    return instance;
  },
};

class ApplicationDoc {
  constructor(doc) {
    Object.assign(this, doc);
    this._id = this._id || objectId();
    this.createdAt = this.createdAt || now();
    this.updatedAt = this.updatedAt || now();
    this.appliedAt = this.appliedAt || new Date().toISOString();
  }
  async save() {
    const existing = await Application.findById(this._id);
    if (existing) {
      await Application.findByIdAndUpdate(this._id, { ...this, updatedAt: now() });
      return this;
    }
    const items = await readCollection('applications');
    items.push({ ...this });
    await writeCollection('applications', items);
    return this;
  }
  select(expr) {
    return projectFields(this, expr);
  }
}

function newApplication(doc) {
  return new ApplicationDoc(doc);
}

// Contact messages (allow multiple entries per email)
const ContactMessage = makeCollection('contactmessages', { uniqueEmail: false });

// Admin
const Admin = {
  ...makeCollection('admins'),
  async findOne(filter) {
    const doc = await makeCollection('admins').findOne(filter);
    return doc ? { ...doc, userType: 'admin' } : null;
  },
};

module.exports = {
  Student,
  Recruiter,
  Admin,
  Application,
  newApplication,
  ContactMessage,
};


