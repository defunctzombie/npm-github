# npm-github

Example and demo registry to allow for npm to install package directly from github. Works for public and private repositories.

# why

Private npm registries are cool, they are often cumbersome to setup and are a bit of an overkill right now. Since your sourcecode already lives on github, why not just install directly from github using npm.

The problem with the current support for github in npm is that it doesn't work well for private repos. To download private repos you have to use the less elegant git+ssh uri syntax and make your package.json files look terrible.

To solve these issues and provide a "cheap" (both in cost and complexity) solution to installing from github via npm, an npm registry proxy can be used. Previously, you would need to proxy all requests through this fake registry but with the addition of the [scopes](http://blog.nodejitsu.com/a-summary-of-scoped-modules-in-npm/) this can actually be done on a per organization or user level and also makes installing private repos as modules much simpler.

# setup

You need to use npm v1.5+ for the scopes features. The easiest way to do this without messing up your existing install is to use the `npm-next` module. Install it globally (as shown below) and run it whenever you would normally run the `npm` cli command.

```
$ npm i -g npm-next
$ npm-next -v
2.0.0-beta.2
```

## configure npm

npm needs to be told where to find our scoped modules. In our example, we are going to download a module from my personal github account. To educate npm about how to handle `@defunctzombie` scope, add the following to your `$HOME/.npmrc` file

```
@defunctzombie:registry=http://npm-github.herokuapp.com
```

This tells npm that whenever it sees a module that starts with `@defunctzombie/` to download it from the npm-github.herokuapp.com registry and not the default main npm registry.

The same process is used for organizations.

## install a scoped module

I have created a demo scoped module to test your setup. Run the command below. Notice that this module [scope-test-02](https://github.com/defunctzombie/scope-test-02) and its dependency do not live on the npm registry but are downloaded via the demo proxy and installed as regular modules.

```
$ npm-next install @defunctzombie/scope-test-02
```

If everything is configured correctly you should see the following output

```
@defunctzombie/scope-test-02@0.0.2 node_modules/@defunctzombie/scope-test-02
└── @defunctzombie/scope-test-01@0.0.2
```

If you wish to add the scoped module to your app's package.json, simply use the full scoped name as the module name.

```json
{
    "dependencies": {
        "@defunctzombie/scope-test-01": "0.0.2"
    }
}
```

# private repositories

If you have a private github repository and wish to install that as an npm module the registry proxy supports that too. One benefit to the approach used here is that you can continue using github to manage user access to your repositories without configuring another permission system.

First, you need to create an oauth token using whatever github account has access to the private repo you wish to install. Follow [these](https://help.github.com/articles/creating-an-access-token-for-command-line-use) instructions from github.

Then, once again edit your `.npmrc` file and add the following lines after the existing `@defunctzombie/` line. Note, you will need these lines under every `@user` or `@org` that has private repos you wish to install.

```
@defunctzombie:registry=http://npm-github.herokuapp.com
//npm-github.herokuapp.com/:always-auth=true
//npm-github.herokuapp.com/:_authToken=<token here>
```

These credentials WILL BE SENT to the heroku demo app which will use them to grant access to the private repository.

That's it! You can now install any private repo your user account has access to via npm. For CI systems, simply make a CI github user and token with only the repo access you need.

**Note**: while I am not storing any github auth tokens, PLEASE run your own copy of the registry code for any serious use. The heroku app is only a demo.

# gotchas and tips

* You must tag the version in github before you can install it.
