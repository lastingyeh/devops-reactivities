import { Activity } from '../models/activity';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';

export default class ActivityStore {
	activityRegistry = new Map<string, Activity>();
	selectedActivity: Activity | undefined = undefined;
	editMode = false;
	loading = false;
	loadingInitial = false;

	constructor() {
		makeAutoObservable(this);

		// makeObservable(this, {
		// 	title: observable,
		//   // [setTitle: action] must implement it that use arrow function
		//   // [setTitle: action.bound] just use function setTitle(){}
		// 	setTitle: action,
		// });
	}

	// computed property
	get activitiesByDate() {
		return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
	}

	get groupedActivities() {
    // {date: activity} => [[date, activity]]
		return Object.entries(
			this.activitiesByDate.reduce((activities, activity) => {
				const date = activity.date;
				activities[date] = activities[date] ? [...activities[date], activity] : [activity];
				return activities;
			}, {} as { [key: string]: Activity[] })
		);
	}

	// use action instead of runInAction
	setLoadingInitial = (state: boolean) => {
		this.loadingInitial = state;
	};

	loadActivities = async () => {
		this.setLoadingInitial(true);

		try {
			const activities = await agent.Activities.list();

			activities.forEach(activity => {
				this.setActivity(activity);
			});
		} catch (error) {
			console.log(error);
		}
		this.setLoadingInitial(false);
	};

	private getActivity = (id: string) => this.activityRegistry.get(id);

	private setActivity = (activity: Activity) => {
		activity.date = activity.date.split('T')[0];
		this.activityRegistry.set(activity.id, activity);
	};

	loadActivity = async (id: string) => {
		let activity = this.getActivity(id);

		if (!activity) {
			this.loadingInitial = true;
			try {
				activity = await agent.Activities.details(id);
				this.setActivity(activity);
			} catch (error) {
				console.log(error);
			}

			this.setLoadingInitial(false);
		}

		runInAction(() => {
			this.selectedActivity = activity;
		});

		return activity;
	};

	createActivity = async (activity: Activity) => {
		this.loading = true;

		try {
			await agent.Activities.create(activity);

			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.selectedActivity = activity;
			});
		} catch (error) {
			console.log(error);
		}

		runInAction(() => {
			this.editMode = false;
			this.loading = false;
		});
	};

	updateActivity = async (activity: Activity) => {
		this.loading = true;

		try {
			await agent.Activities.update(activity);

			runInAction(() => {
				this.activityRegistry.set(activity.id, activity);
				this.selectedActivity = activity;
			});
		} catch (error) {
			console.log(error);
		}

		runInAction(() => {
			this.editMode = false;
			this.loading = false;
		});
	};

	deleteActivity = async (id: string) => {
		this.loading = true;
		try {
			await agent.Activities.delete(id);
			runInAction(() => {
				this.activityRegistry.delete(id);
				this.selectedActivity = undefined;
			});
		} catch (error) {
			console.log(error);
		}
		runInAction(() => {
			this.loading = false;
		});
	};
}
