import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app';

import Index_home from './components/index_home';
import UserLogin from './components/user/login';
import UserLogout from './components/user/logout';
import UserRegister from './components/user/register';
import UserProfile from './components/user/profile';
import ResetPassword from './components/user/reset_password';
import ScheduleGen from './components/user/scheduleGen';
import requireAuth from './utils/authenticated';


export default (
    <Route path="/" component={App} >
        <IndexRoute component={Index_home} onEnter={requireAuth} />
        <Route path="/login" component={UserLogin} />
        <Route path="/register" component={UserRegister} />
        <Route path="/reset" component={ResetPassword} />
        <Route path="/profile" component={UserProfile} onEnter={requireAuth} />
        <Route path="/scheduleGen" component={ScheduleGen} onEnter={requireAuth} />
      <Route path="/index_home" component={Index_home} onEnter={requireAuth} />
    </Route>

);
