cd EmbeddedProto
python3 setup.py
cd ..

mkdir -p ./ESP32_Client/src/protocol
mkdir -p d./ESP32_Client/src/embedded_proto

protoc --plugin=protoc-gen-eams=./EmbeddedProto/protoc-gen-eams -I ./Protocol --eams_out=./ESP32_Client/src/protocol protocol.proto
cp ./EmbeddedProto/src/* ./ESP32_Client/src/embedded_proto
