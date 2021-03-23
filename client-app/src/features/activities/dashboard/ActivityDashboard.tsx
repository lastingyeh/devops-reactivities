import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid, Loader } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityList from './ActivityList';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityFilters from './ActivityFilters';
import { PagingParams } from '../../../app/models/pagination';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

function ActivityDashboard() {
	const {
		activityStore: { loadingInitial, loadActivities, activityRegistry, setPagingParams, pagination },
	} = useStore();

	const [loadingNext, setLoadingNext] = useState(false);

	useEffect(() => {
		if (activityRegistry.size <= 1) loadActivities();
	}, [activityRegistry.size, loadActivities]);

	const handleGetNext = () => {
		setLoadingNext(true);
		setPagingParams(new PagingParams(pagination!.currentPage + 1));

		loadActivities().then(() => setLoadingNext(false));
	};

	return (
		<Grid>
			<Grid.Column width='10'>
				{loadingInitial && !loadingNext ? (
					<>
						<ActivityListItemPlaceholder />
						<ActivityListItemPlaceholder />
					</>
				) : (
					<InfiniteScroll
						pageStart={0}
						loadMore={handleGetNext}
						hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
						initialLoad={false}
					>
						<ActivityList />
					</InfiniteScroll>
				)}
				<ActivityList />
			</Grid.Column>
			<Grid.Column width='6'>
				<ActivityFilters />
			</Grid.Column>
			<Grid.Column width='10'>
				<Loader active={loadingNext} />
			</Grid.Column>
		</Grid>
	);
}

export default observer(ActivityDashboard);
