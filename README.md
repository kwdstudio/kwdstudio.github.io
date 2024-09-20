# kwdstudio.github.io

## Local development

1. Open Terminal
2. Go to folder `cd Sites/kwdstudio.github.io`
3. Run `bundle install`
4. Run `npm install`
5. Run `npm start`
   * The app will start on http://localhost:4000.

Edit Sass/JavaScript files in the `src/` directory. The browser will auto-reload when changes are detected.

Committing will take a bit longer than usual, as production-ready CSS/JS will be built automatically using a git hook. Have patience.

### Staging

First, run `npm run build:staging` to build the site to `_site` with the config for staging.

Manually upload the contents (or only the changed/added files) of `_site` to the bucket on S3.
