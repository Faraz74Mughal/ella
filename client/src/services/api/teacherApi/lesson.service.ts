import { ILesson } from "@/types/lessonInterface";
import { Service } from "../handler";

class LessonService extends Service {
  constructor(name: string) {
    super(name);
  }
  async addLesson(data:ILesson) {
    return await this.post("/",data,{},true);
  }

  async getLessons() {
    return await this.get("/");
  }
}

const lessonService = new LessonService("/lessons");

export default lessonService;
