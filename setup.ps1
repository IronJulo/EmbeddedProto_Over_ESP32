# Setup EmbeddedProto
cd EmbeddedProto
python setup.py
cd ..

# Setup ESP32_Client
protoc --plugin=protoc-gen-eams=.\EmbeddedProto\protoc-gen-eams.bat -I .\Protocol\ --eams_out=.\ESP32_Client\src\protocol protocol.proto

# Setup express_backend
# protoc -I .\Protocol\ --ts_out=.\express_backend\generated\ protocol.proto
protoc -I .\Protocol --ts_out=.\express_backend\src\generated basic.proto

cp .\EmbeddedProto\src\* .\ESP32_Client\src\embedded_proto

# Setup Backend
cd Backend
npm i
npm run server

