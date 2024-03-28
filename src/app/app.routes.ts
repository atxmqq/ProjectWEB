import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { VoteComponent } from './components/vote/vote.component';
import { ProfileComponent } from './components/profile/profile.component';
import { Top10Component } from './components/top10/top10.component';
import { GraphComponent } from './components/graph/graph.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { WatchprofileComponent } from './components/watchprofile/watchprofile.component';

export const routes: Routes = [
    {
        path: '', component: HomepageComponent
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'signup', component: SignupComponent
    },
    {
        path: 'vote', component: VoteComponent
    },
    {
        path: 'profile', component: ProfileComponent
    },
    {
        path: 'top10', component: Top10Component
    },
    {
        path: 'graph/:pid', component: GraphComponent
    },
    {
        path: 'userlist', component: UserlistComponent
    },
    {
        path: 'watchprofile/:uid', component: WatchprofileComponent
    }


];
