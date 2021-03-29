import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';
import PrivateRoute from './PrivateRoute';

function App() {
	const { key } = useLocation();
	const {
		commonStore: { token, setAppLoaded, appLoaded },
		userStore: { getUser },
	} = useStore();

	useEffect(() => {
		if (token) {
			getUser().finally(() => setAppLoaded());
		} else {
			setAppLoaded();
		}
	}, [token, setAppLoaded, getUser]);

	if (!appLoaded) return <LoadingComponent content='Loading activities...' />;

	return (
		<>
			<ToastContainer position='bottom-right' hideProgressBar />
			<ModalContainer />
			<Route exact path='/' component={HomePage} />
			<Route
				path={'/(.+)'}
				render={() => (
					<>
						<NavBar />
						<Container style={{ marginTop: '7em' }}>
							<Switch>
								<PrivateRoute exact path='/activities' component={ActivityDashboard} />
								<PrivateRoute path='/activities/:id' component={ActivityDetails} />
								<PrivateRoute key={key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
								<PrivateRoute path='/profiles/:username' component={ProfilePage} />
								<PrivateRoute path='/errors' component={TestErrors} />
								<Route path='/server-error' component={ServerError} />
								<Route component={NotFound} />
							</Switch>
						</Container>
					</>
				)}
			/>
		</>
	);
}

export default observer(App);
