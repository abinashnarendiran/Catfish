# Catfish 

### Installation
Clone the repo and cd into the Catfish directory
```
git clone https://github.com/adwansyed/Catfish.git
cd Catfish
```

Install the dependencies

```sh
$ npm install
```

Import user collection into mongoDB (Note: If path variables are not configured copy catfishdb_users.json into your mongodb/bin directory before issuing command)
```
mongoimport --db catfishdb --collection users --file catfishdb_users.json
```

Run app

```sh
$ npm start 
    OR 
$ nodemon
```

### USE CASE: Login with a TEST USER and start matching:

Here are some test users for your personal usage. Please create your own test user as well.

| Username                       | Password | 
|--------------------------------|----------|
| spongebob@squarepants.com      | password |
| fishy@catfish.com              | password |
| bob@thebuilder.com             | password |
| swimmy@cafish.com              | password |
| franklin@theturtle.com         | password |
| clifford@bigreddog.com         | password |
| patrick@starfish.com           | password |


![homepage](https://user-images.githubusercontent.com/1751112/38582308-519ccc0a-3cdd-11e8-8b4a-b04efe0affeb.JPG)
![matching](https://user-images.githubusercontent.com/1751112/38582315-584e6bc6-3cdd-11e8-856a-e1c0feaf64ba.JPG)

#### USE CASE: When you are matched, you will receive an email to the email address you specified when creating an account. 
![someonelikesyou](https://user-images.githubusercontent.com/1751112/38582987-9732849c-3cdf-11e8-9da2-039b996fca6d.JPG)


#### USE CASE: To further test the mailing functinality please consider using the contact form:
![contact](https://user-images.githubusercontent.com/1751112/38583126-09d17de6-3ce0-11e8-8421-f2714fc08573.JPG)
![emailfromcatfish](https://user-images.githubusercontent.com/1751112/38583000-9b43b830-3cdf-11e8-8a9b-d6e7cc4bbeb5.JPG)

#### Contributers
Adwan Syed,
Abinash Narendiran,
Mohammed Ahmed
