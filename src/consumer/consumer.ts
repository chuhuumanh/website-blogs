import { OnQueueActive, Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { PostService } from "src/post/post.service";

@Processor('webBlog')
export class Consumer {
    private readonly logger = new Logger(Consumer.name);
    constructor(private postService: PostService){}
    @Process('findUserPosts')
    async findUserPostConsumer(job: Job<object>){
        try{
            return await this.postService.getUserPost(job.data['user']);
        }
        catch(err){
            this.logger.error(err);
        }
    }

    @OnQueueActive()
    onActive(job: Job){
        this.logger.log(`Processing ${job.name} requested by user has id: ${job.data['user'].id} ...`);
    }
}
