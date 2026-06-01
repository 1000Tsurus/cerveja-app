CLI_NAME = eas-cli
COMMAND_NAME = Build-project

.PHONY: install login configure build-android build-all status clean

install:
	npm install -g $(CLI_NAME)

login:
	eas login
	eas whoami

configure:
	eas build:configure
	npx expo install expo-dev-client

build-android:
	eas build --platform android

build-all:
	eas build --platform all

status:
	eas build:list

clean:
	rm -rf .expo
start:
	npx expo start
