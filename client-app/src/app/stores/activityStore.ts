import { Profile } from './../models/profile';
import { store } from './store';
import { Activity, ActivityFormValues } from '../models/activity';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { format } from 'date-fns';

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
		return Array.from(this.activityRegistry.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime());
	}

	get groupedActivities() {
		// {date: activity} => [[date, activity]]
		return Object.entries(
			this.activitiesByDate.reduce((activities, activity) => {
				const date = format(activity.date!, 'dd MMM yyyy');
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
		const user = store.userStore.user;

		if (user) {
			activity.isGoing = activity.attendees?.some(a => a.username === user.username);
			activity.isHost = activity.hostUsername === user.username;
			activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
		}

		activity.date = new Date(activity.date!);
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

	createActivity = async (activity: ActivityFormValues) => {
		const user = store.userStore.user;
		const attendee = new Profile(user!);

		try {
			await agent.Activities.create(activity);

			const newActivity = new Activity(activity);

			newActivity.hostUsername = user!.username;
			newActivity.attendees = [attendee];

			this.setActivity(newActivity);

			runInAction(() => {
				this.selectedActivity = newActivity;
			});
		} catch (error) {
			console.log(error);
		}
	};

	updateActivity = async (activity: ActivityFormValues) => {
		try {
			await agent.Activities.update(activity);

			runInAction(() => {
				if (activity.id) {
					const updatedActivity = { ...this.getActivity(activity.id), ...activity };

					this.activityRegistry.set(activity.id, updatedActivity as Activity);
					this.selectedActivity = updatedActivity as Activity;
				}
			});
		} catch (error) {
			console.log(error);
		}
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

	updateAttendance = async () => {
		const user = store.userStore.user;

		this.loading = true;

		try {
			await agent.Activities.attend(this.selectedActivity!.id);

			runInAction(() => {
				// as isGoring is true => set to false and remove from attendees
				if (this.selectedActivity?.isGoing) {
					this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.username !== user?.username);
					this.selectedActivity.isGoing = false;
				} else {
					const attendee = new Profile(user!);
					this.selectedActivity?.attendees?.push(attendee);
					this.selectedActivity!.isGoing = true;
				}
				this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
			});
		} catch (error) {
			console.log(error);
		}
		runInAction(() => {
			this.loading = false;
		});
	};

	cancelActivityToggle = async () => {
		this.loading = true;

		try {
			await agent.Activities.attend(this.selectedActivity!.id);

			runInAction(() => {
				this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
				this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
			});
		} catch (error) {
			console.log(error);
		}
		runInAction(() => {
			this.loading = false;
		});
	};

	clearSelectedActivity = () => {
		this.selectedActivity = undefined;
	};
}
