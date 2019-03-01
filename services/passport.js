const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const keys = require('../config/keys');

const User = mongoose.model('users');
// passport

passport.serializeUser((user, done) => {
	// user.id is a unique identifier to the 'row-id'
	// used because the user might have another authentication method than googleID (profile.id)
	done(null, user.id);
});

// this id is from user.id
// turn id into mongo id instance
passport.deserializeUser((id, done) => {
	// find user by mongodb id and pass user through passport
	User.findById(id).then(user => {
		done(null, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback'
		},
		(accessToken, refreshToken, profile, done) => {
			User.findOne({ googleID: profile.id }).then(existingUser => {
				if (existingUser) {
					// we already have a record of this user
					done(null, existingUser);
				} else {
					new User({ googleID: profile.id })
						.save()
						.then(user => done(null, user));
				}
			});
		}
	)
);
