# Como vai funcionar

# O app tem que pegar as informaçoes do bluetooth

- Pegar permissão de bluetooth -> celular
- Conectar no esp32 -> controlar o circuito
- Mandar solicitação para ligar e desligar

# metas

# json

Informacoes:
temp: float,
quantidade_consumida: float

# Sensor

- Esp retorna um json com os valores do sensor
- app le o json e retorna para o metodo view()
- O sensor deve esta dentro do container

# Medição da quantidade x Tempo

Tempo x Vasão = quantidade
x \* Vasão = 200ml
