#include <Arduino.h>

#include <WiFi.h>
#include "secret.hpp"
#include "protocol.h"
#include <WriteBufferFixedSize.h>

const int deviceId = 123456789;

WiFiClient client;

EmbeddedProto::WriteBufferFixedSize<256> writeBuffer;

test::device deviceData;
test::ping pingData;

void connectToWifi()
{
	Serial.begin(9600);
	delay(1000);

	WiFi.mode(WIFI_STA); // Optional
	WiFi.begin(SECRET_SSID, SECRET_PASS);
	Serial.println("\nConnecting");

	while (WiFi.status() != WL_CONNECTED)
		;

	Serial.println("\nConnected to the WiFi network");
	Serial.print("Local ESP32 IP: ");
	Serial.println(WiFi.localIP());
}

bool pingServer()
{
	deviceData.set_device_serial_id(deviceId);
	pingData.set_device_data(deviceData);

	const auto serialize_result = pingData.serialize(writeBuffer);

	bool result = false;
	if (client.connect(SERVER_IP, SERVER_PORT))
	{
		Serial.println("Sending N bytes to the server: " + String(writeBuffer.get_size()));
		for (int i = 0; i < writeBuffer.get_size(); ++i)
		{
			const byte b = *(writeBuffer.get_data() + i);
			Serial.print(b);
			Serial.print(" ");
		}
		Serial.println();

		Serial.println("POST /api/data HTTP/1.1");
		Serial.println("Host: " + String(SERVER_IP) + "/api/data");
		Serial.println("Content-Type: application/x-protobuf");
		Serial.println("Connection: close");
		Serial.println("Transfer-Encoding: chunked");
		Serial.println("");
		Serial.println(writeBuffer.get_size(), HEX);
		Serial.write(writeBuffer.get_data(), writeBuffer.get_size());
		Serial.println();
		Serial.println('0');
		Serial.println();

		client.println("POST /api/data HTTP/1.1");
		client.println("Host: " + String(SERVER_IP) + "/api/data");
		client.println("Content-Type: application/x-protobuf");
		client.println("Connection: close");
		client.println("Transfer-Encoding: chunked");
		client.println("");
		client.println(writeBuffer.get_size(), HEX);
		client.write(writeBuffer.get_data(), writeBuffer.get_size());
		client.println();
		client.println('0');
		client.println();

		// Next wait for the response.
		Serial.println();

		delay(500);

		while (client.available())
		{
			String string = client.readStringUntil('\n');
			Serial.println(string);
			if (string.startsWith(""))
			{
				result = true;
			}
		}
	}
	else
	{
		Serial.println("Failed to connect to server.");
	}

	client.stop();
	writeBuffer.clear();
	return result;
}

void setup()
{
	Serial.begin(9600);
	connectToWifi();
	pingServer();
	Serial.println("Waiting...");
}

void loop()
{
	pingServer();
	delay(500);
}