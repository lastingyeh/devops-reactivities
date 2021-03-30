import { UserFormValues } from './../models/user';
import { makeAutoObservable, runInAction } from 'mobx';
import { User } from '../models/user';
import agent from '../api/agent';
import { store } from './store';
import { history } from '../..';

export default class UserStore {
	user: User | null = null;
	fbAccessToken: string | null = null;
	fbLoading = false;
	refreshTokenTimeout: any;

	constructor() {
		makeAutoObservable(this);
	}

	get isLoggedIn() {
		return !!this.user;
	}

	login = async (creds: UserFormValues) => {
		try {
			const user = await agent.Account.login(creds);

			runInAction(() => {
                this.user = user;
                store.commonStore.setToken(user.token);
                this.startRefreshTokenTimer(user);
			});

			history.push('/activities');
			store.modalStore.closeModal();
		} catch (error) {
			throw error;
		}
	};

	logout = () => {
		if (this.refreshTokenTimeout) {
			this.stopRefreshTokenTimer();
		}

		window.localStorage.removeItem('jwt');
		store.commonStore.setToken(null);
		this.user = null;
		history.push('/');
	};

	getUser = async () => {
		try {
			const user = await agent.Account.current();

			runInAction(() => {
				this.user = user;
				store.commonStore.setToken(user.token);
				this.startRefreshTokenTimer(user);
			});
		} catch (error) {
			console.log(error);
		}
	};

	register = async (creds: UserFormValues) => {
		try {
			await agent.Account.register(creds);

			history.push('/activities');

			store.modalStore.closeModal();
		} catch (error) {
			throw error;
		}
	};

	setImage = (image: string) => {
		if (this.user) {
			this.user.image = image;
		}
	};

	setDisplayName = (name: string) => {
		if (this.user) this.user.displayName = name;
	};

	getFacebookLoginStatus = async () => {
		window.FB.getLoginStatus(response => {
			if (response.status === 'connected') {
				this.fbAccessToken = response.authResponse.accessToken;
			}
		});
	};

	facebookLogin = () => {
		const apiLogin = (accessToken: string) => {
			agent.Account.fbLogin(accessToken)
				.then(user => {
					if (user) {
						runInAction(() => {
							this.user = user;
							store.commonStore.setToken(user.token);
							this.startRefreshTokenTimer(user);
						});

						history.push('/activities');
					}
				})
				.catch(error => console.log(error))
				.finally(() => {
					runInAction(() => (this.fbLoading = false));
				});
		};

		this.fbLoading = true;

		if (this.fbAccessToken) {
			apiLogin(this.fbAccessToken);
		} else {
			window.FB.login(
				response => {
					apiLogin(response.authResponse.accessToken);
				},
				{ scope: 'public_profile,email' }
			);
		}
	};

	refreshToken = async () => {
		this.stopRefreshTokenTimer();

		try {
			const user = await agent.Account.refreshToken();

			runInAction(() => {
				this.user = user;
				store.commonStore.setToken(user.token);
				this.startRefreshTokenTimer(user);
			});
		} catch (error) {
			console.log(error);
		}
	};

	private startRefreshTokenTimer(user: User) {
		const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
		const expires = new Date(jwtToken.exp * 1000);
		const timeout = expires.getTime() - Date.now() - 1 * 1000;

		this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
	}

	private stopRefreshTokenTimer() {
		clearTimeout(this.refreshTokenTimeout);
	}
}
