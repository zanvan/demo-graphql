import { switchMap } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { User, Post } from '../../models';
import { UsersService } from '../users.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { StatsService } from '../../stats.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    user: User;
    selectedPost: Post;

    constructor(
        private srv: UsersService,
        private stats: StatsService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(prm => {
            this.stats.startCollectingDataRest('user-posts');
            this.srv.getUserById(+prm.get('id')).subscribe(user => {
                this.user = user;
                this.stats.setData(user);
                this.stats.stopCollectingDataRest('user-posts');
            });
        });

    }

    onPostSelected(post) {
        this.stats.startCollectingDataRest('post-comments');
        this.srv.getCommentsForPost(post.id)
            .subscribe(comments => {
                post.comments = comments;
                this.selectedPost = post;

                this.stats.setData(comments);
                this.stats.stopCollectingDataRest('post-comments');
            });
    }
}
