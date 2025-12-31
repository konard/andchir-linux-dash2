<h1 align="center">
  <a href="https://afaqurk.github.io/linux-dash">
    <img src="https://raw.githubusercontent.com/afaqurk/screenshots/master/linux-dash/v2.0-logo.png"/>
  </a>
</h1>

<p align="center">
  <sub>v2.0</sub><br/>
  <small>A simple & low-overhead web dashboard for linux systems</small>
</p>

<p align="center">
  <small>
    <a href="https://afaqurk.github.io/linux-dash">Demo</a> &nbsp;|&nbsp;
    <a href="https://github.com/afaqurk/linux-dash/wiki">
      Docs
    </a>
  </small>
</p>


<p align="center">
  <a href="https://gitter.im/afaqurk/linux-dash">
    <img
      src="https://badges.gitter.im/gitterHQ/gitter.png"
      alt="linux-dash Gitter chat">
  </a>
</p>

<br/>

## Features
* **Small** ----- Under 400KB on disk _(with .git removed)!_
* **Simple** ---- A minimalist, beautiful dashboard
* **Easy** ------ Drop-in installation
* **Versatile** -- Choose your stack from Node.js, Go, Python, PHP
* **Customizable** -- Support for custom skins/themes

## Installation

### Step 1
```sh
## 1. clone the repo
git clone --depth 1 https://github.com/afaqurk/linux-dash.git

## 2. go to the cloned directory
cd linux-dash/app/server

```
OR, if you prefer to download manually:

```sh
## 1. Download the .zip
curl -LOk https://github.com/afaqurk/linux-dash/archive/master.zip && unzip master.zip

## 2. navigate to downloaded & unzipped dir
cd linux-dash-master/app/server

```

### Step 2

See instructions for preferred server linux-dash server _(all included)_:

* [Node.js](#if-using-nodejs) _(recommended)_
* [Go](#if-using-go)
* [Python](#if-using-python)
* [PHP](#if-using-php)

#### If Using Node.js
```sh
## install dependencies
npm install --production

## start linux-dash (on port 80 by default; may require sudo)
## You may change this with the `LINUX_DASH_SERVER_PORT` environment variable (eg. `LINUX_DASH_SERVER_PORT=8080 node server`)
## or provide a --port flag to the command below
## Additionally, the server will listen on every network interface (`0.0.0.0`).
## You may change this with the `LINUX_DASH_SERVER_HOST` environment variable (eg. `LINUX_DASH_SERVER_HOST=127.0.0.1 node server`)
## or provide a --host flag to the command below
node index.js

```

#### If Using Go
```sh
## start the server (on port 80 by default; may require sudo)
go run index.go
```

To build a binary, run `go build && ./server -h`. See [@tehbilly](https://github.com/sergeifilippov)'s notes [here](https://github.com/afaqurk/linux-dash/pull/281) for binary usage options

#### If Using Python
```sh
# For Python 2 (legacy, deprecated)
python index.py

# For Python 3 (recommended)
python3 server/server_py3.py --port 8080
```

The Python 3 server (`server/server_py3.py`) includes:
- Modern Python 3 syntax using `http.server` and `socketserver`
- Improved MIME type handling
- Protection against directory traversal attacks
- Proper handling of binary files

#### If Using PHP

1. Make sure you have the `exec`, `shell_exec`, and `escapeshellarg` functions enabled
2. Point your web server to `app/` directory under `linux-dash`
2. Restart your web server (Apache, nginx, etc.)
  - For PHP + Apache setup follow the [Digital Ocean tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-linux-dash-on-ubuntu-14-04).
  - For help with nginx setup, see [this gist](https://gist.github.com/sergeifilippov/8909839) by [@sergeifilippov](https://github.com/sergeifilippov).

## Customization with Skins

Linux-dash now supports customizable skins (themes) to personalize the appearance of your dashboard. Skins allow you to change colors, typography, and overall visual style.

### Available Skins

#### Flat Skin (Dark Theme)
A modern, flat dark theme featuring:
- Medium-dark background (not too harsh on the eyes)
- No shadows - clean, flat design with subtle borders
- Rounded corners (12-16px border radius)
- Modern typography using Inter font
- Purple/blue accents for headings
- Teal/green accents for progress bars
- Smooth animations and transitions

![Flat Skin Screenshot](https://raw.githubusercontent.com/andchir/linux-dash2/refs/heads/master/screenshots/flat-skin.png)

### Using a Skin

To apply a skin, edit `app/index.html` and change the skin CSS link:

```html
<!-- Skin: uncomment to apply a skin, or change 'flat' to another skin name -->
<link href='skins/flat.min.css' rel='stylesheet' type='text/css' id='skin-css'>
```

To disable skins and use the default theme, simply comment out or remove the skin CSS link.

### Creating Custom Skins

You can create your own custom skins:

1. Create a new directory under `src/css/skins/your-skin-name/`
2. Add your CSS file(s) in that directory (e.g., `your-skin-name.css`)
3. Build the skin using one of these methods:

**Option A: Using Gulp (automated build system)**
```sh
# Install dependencies first (if not already installed)
npm install

# Build all skins
gulp --gulpfile gulpfile_skins.js build

# Or build and watch for changes during development
gulp --gulpfile gulpfile_skins.js
```

**Option B: Using clean-css-cli (manual build)**
```sh
# Install clean-css-cli if not already installed
npm install -g clean-css-cli

# Build your skin
npx cleancss -o app/skins/your-skin-name.min.css src/css/skins/your-skin-name/your-skin-name.css
```

4. Update `app/index.html` to reference your new skin:
```html
<link href='skins/your-skin-name.min.css' rel='stylesheet' type='text/css' id='skin-css'>
```

The gulpfile_skins.js build system will automatically:
- Find all skin directories in `src/css/skins/`
- Minify and concatenate CSS files
- Output minified skins to `app/skins/`

### Skin Development Tips

- Use CSS custom properties (variables) for easy color customization
- Start from the existing flat skin as a reference (`src/css/skins/flat/flat.css`)
- The skin CSS will override the default styles from `linuxDash.min.css`
- Test your skin by running the server and checking different dashboard sections

## Support

For general help, please use the [Gitter chat room](https://gitter.im/afaqurk/linux-dash).

## Security

**It is strongly recommended** that all linux-dash installations be protected via a security measure of your choice.

Linux Dash does not provide any security or authentication features.
