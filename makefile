# Variáveis de configuração
PM = npm # Altere para yarn, pnpm ou bun se preferir

.PHONY: help install start android ios clean reset

help:
	@echo "Comandos disponíveis no projeto:"
	@echo "  make install  - Instala as dependências do projeto"
	@echo "  make start    - Inicia o servidor Metro Bundler (JavaScript)"
	@echo "  make android  - Compila e roda o app nativo no dispositivo/emulador Android"
	@echo "  make ios      - Compila e roda o app nativo no simulador/dispositivo iOS"
	@echo "  make clean    - Limpa os arquivos temporários e caches do Expo/Metro"
	@echo "  make reset    - Limpa tudo (node_modules) e reinstala do zero"

install:
	$(PM) install

start:
	npx expo start

apk:
	npx expo prebuild --platform android
	cd android && ./gradlew assembleReleaseclean:
	rm -rf .expo
	npx expo start --clear

reset:
	rm -rf node_modules
	rm -rf .expo
	$(PM) install
