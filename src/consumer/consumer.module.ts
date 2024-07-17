import { Module } from '@nestjs/common';
import { Consumer } from './consumer';
import { PostModule } from 'src/post/post.module';
import { PostService } from 'src/post/post.service';
@Module({
    imports: [PostModule],
    providers: [Consumer]
})
export class ConsumerModule {}
