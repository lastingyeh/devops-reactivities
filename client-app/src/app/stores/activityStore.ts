import { Activity } from './../layout/models/activity';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { v4 as uuid } from 'uuid';

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

	// use action instead of runInAction
	setLoadingInitial = (state: boolean) => {
		this.loadingInitial = state;
	};

	loadActivities = async () => {
		this.setLoadingInitial(true);

		try {
			const activities = await agent.Activities.list();

			activities.forEach(activity => {
				activity.date = activity.date.split('T')[0];
				this.activityRegistry.set(activity.id, activity);
				// this.activities.push(activity);
			});
		} catch (error) {
			console.log(error);
		}
		this.setLoadingInitial(false);
	};

	selectActivity = (id: string) => {
		this.selectedActivity = this.activityRegistry.get(id);
	};

	cancelSelectedActivity = () => {
		this.selectedActivity = undefined;
	};

	openForm = (id?: string) => {
		id ? this.selectActivity(id) : this.cancelSelectedActivity();
		this.editMode = true;
	};

	closeForm = () => {
		this.editMode = false;
	};

	createActivity = async (activity: Activity) => {
		this.loading = true;
		activity.id = uuid();

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
