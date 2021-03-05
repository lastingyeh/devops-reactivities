import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
	const {
		activityStore: { loadActivities, loadingInitial},
	} = useStore();

	useEffect(() => {
		agent.Activities.list().then(response => {
			loadActivities();
		});
	}, [loadActivities]);

	// loading
	if (loadingInitial) {
		return <LoadingComponent content='Loading app' />;
	}

	return (
		<>
			<NavBar />
			<Container style={{ marginTop: '7em' }}>
				<ActivityDashboard />
			</Container>
		</>
	);
}

export default observer(App);
