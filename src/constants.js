export const ADMIN_CREDS = { username: "admin", password: "admin1234" };
export const STORAGE_KEY = "sms_portal_react_v1";
export const DEPT_KEY = "sms_portal_depts_v1";

export const SEED_DEPTS = [
  { id: 1, name: "Computer Science",       code: "CS",  hod: "Dr. R. Suresh",  intake: 60 },
  { id: 2, name: "Information Technology", code: "IT",  hod: "Dr. P. Meena",   intake: 60 },
  { id: 3, name: "Electronics",            code: "EC",  hod: "Prof. K. Rajan", intake: 60 },
  { id: 4, name: "Mechanical",             code: "ME",  hod: "Dr. S. Bala",    intake: 60 },
  { id: 5, name: "Civil",                  code: "CE",  hod: "Prof. A. Kumar", intake: 60 },
  { id: 6, name: "Business Administration",code: "MBA", hod: "Dr. V. Priya",   intake: 60 },
];

export const SEED_STUDENTS = [
  { id: 1, name: "Arun Kumar",     roll: "CS2019001", dept: "Computer Science",        batchFrom: "2019", batchTo: "2023", gender: "Male",   dob: "2001-04-15", email: "arun@email.com",    phone: "9876543210", address: "Chennai",     status: "Graduated", added: Date.now() - 864e5 * 10 },
  { id: 2, name: "Priya Devi",     roll: "IT2021002", dept: "Information Technology",  batchFrom: "2021", batchTo: "2025", gender: "Female", dob: "2003-07-22", email: "priya@email.com",   phone: "9876543211", address: "Coimbatore",  status: "Active",    added: Date.now() - 864e5 * 5  },
  { id: 3, name: "Ravi Shankar",   roll: "EC2022003", dept: "Electronics",             batchFrom: "2022", batchTo: "2026", gender: "Male",   dob: "2004-11-10", email: "ravi@email.com",    phone: "9876543212", address: "Madurai",     status: "Active",    added: Date.now() - 864e5 * 3  },
  { id: 4, name: "Meena Lakshmi",  roll: "ME2023004", dept: "Mechanical",              batchFrom: "2023", batchTo: "2027", gender: "Female", dob: "2005-02-28", email: "meena@email.com",   phone: "9876543213", address: "Salem",       status: "Active",    added: Date.now() - 864e5 * 2  },
  { id: 5, name: "Karthik Raja",   roll: "CS2020005", dept: "Computer Science",        batchFrom: "2020", batchTo: "2024", gender: "Male",   dob: "2002-09-05", email: "karthik@email.com", phone: "9876543214", address: "Trichy",      status: "Graduated", added: Date.now() - 864e5      },
];
