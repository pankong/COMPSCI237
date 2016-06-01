package edu.zhangfan.cs237.producer;

import com.google.common.io.Resources;
import com.google.gson.Gson;
import edu.zhangfan.cs237.common.DriverLocationEvent;
import edu.zhangfan.cs237.common.Event;
import edu.zhangfan.cs237.common.Type;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class SampleProducer {

  public static void main(String[] args) throws IOException {
    Producer<String, String> producer;
    try (InputStream in = Resources.getResource("producer.properties").openStream()) {
      Properties properties = new Properties();
      properties.load(in);
      producer = new KafkaProducer<>(properties);
    }

    Gson gson = new Gson();

    try {
      for (int i = 0; i < 100; i++) {
        // sadly that Java does not natively support keyword arguments.
        DriverLocationEvent location = new DriverLocationEvent(76, "6177", 3075, 3828, Type.DRIVER_LOCATION);
        Event event = new Event(76, "6211", 3075, 3823, null, Type.RIDE_REQUEST);
        producer.send(new ProducerRecord<>("driver-locations", Integer.toString(location.getBlockId()), gson.toJson(location)));
        producer.send(new ProducerRecord<>("events", Integer.toString(event.getBlockId()), gson.toJson(event)));
      }
    } catch (Throwable throwable) {
      System.out.println("error");
    } finally {
      producer.close();
    }
  }
}
