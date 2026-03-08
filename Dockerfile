DESDE nodo:20 

WORKDIR /app 

EJECUTAR apt-get update && apt-get install -y python3 ffmpeg 

COPIAR paquete*.json ./ 

EJECUTAR npm install 

COPIAR . . 

CMD [ "nodo" , "index.js" ]