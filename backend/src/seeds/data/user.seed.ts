import bcrypt from "bcryptjs";
import { ACCOUNT_STATUS, USER_ROLES } from "../../constants/user.constant";

const AUTH_PROVIDERS = {
  LOCAL: "local",
};





const hashedPassword = bcrypt.hashSync("1234$Abc", 10);

const usersSeed = [
  {
    username: "admin",
    email: "admin@test.com",
    password: hashedPassword,
    authProvider: AUTH_PROVIDERS.LOCAL,
    role: USER_ROLES.ADMIN,
    accountStatus: ACCOUNT_STATUS.ACTIVE,
    name: "Admin User",
    isEmailVerified: true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    username: "teacher",
    email: "teacher@test.com",
    password: hashedPassword,
    authProvider: AUTH_PROVIDERS.LOCAL,
    role: USER_ROLES.TEACHER,
    accountStatus: ACCOUNT_STATUS.ACTIVE,
    name: "Ahmed Raza",
    isEmailVerified: true,
    isDeleted: false,
    teacherProfile: {
      resumeUrl: "resume-link",
      educationDocuments: ["doc1", "doc2"],
      idProof: {
        front: "front.jpg",
        back: "back.jpg",
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    username: "student",
    email: "student@test.com",
    password: hashedPassword,
    authProvider: AUTH_PROVIDERS.LOCAL,
    role: USER_ROLES.STUDENT,
    accountStatus: ACCOUNT_STATUS.ACTIVE,
    name: "Admin User",
    isEmailVerified: true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const names = [
  "Ahmad Ali",
  "Sara Khan",
  "Usman Tariq",
  "Fatima Noor",
  "Bilal Hussain",
  "Ayesha Malik",
  "Hassan Raza",
  "Zainab Ahmed",
  "Ali Hamza",
  "Iqra Sheikh",
  "Omar Farooq",
  "Hira Aslam",
  "Danish Khan",
  "Mehwish Ali",
  "Saad Qureshi",
  "Nimra Tariq",
  "Talha Ahmed",
  "Kiran Malik",
  "Adnan Sheikh"
];

names.forEach((name, index) => {
  const i = index + 1;

  // 👇 alternate roles
  const role =
    i % 3 === 0 ? USER_ROLES.TEACHER : USER_ROLES.STUDENT;

  const user = {
    username: name.toLowerCase().replace(/ /g, ""),
    email: `${name.toLowerCase().replace(/ /g, "")}@test.com`,
    password: hashedPassword,
    authProvider: AUTH_PROVIDERS.LOCAL,
    role,
    accountStatus: ACCOUNT_STATUS.ACTIVE,
    name,
    isEmailVerified: true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // 👇 Teacher profile add
  if (role === USER_ROLES.TEACHER) {
    (user as any).teacherProfile = {
      resumeUrl: `resume-${i}`,
      educationDocuments: [`doc${i}-1`, `doc${i}-2`],
      idProof: {
        front: `front-${i}.jpg`,
        back: `back-${i}.jpg`,
      },
    };
  }

  (usersSeed as any).push(user);
});

export default usersSeed