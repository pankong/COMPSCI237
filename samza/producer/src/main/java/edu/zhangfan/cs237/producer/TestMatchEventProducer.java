package edu.zhangfan.cs237.producer;

import com.google.common.io.Resources;
import com.google.gson.Gson;
import edu.zhangfan.cs237.common.MatchEvent;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class TestMatchEventProducer {

  public static void main(String[] args) throws IOException {
    Producer<String, String> producer;
    try (InputStream in = Resources.getResource("producer.properties").openStream()) {
      Properties properties = new Properties();
      properties.load(in);
      producer = new KafkaProducer<>(properties);
    }

    Gson gson = new Gson();
    try {
      for (int i = 0; i < 10; i++) {
        // produce one match for every block.
        MatchEvent match = new MatchEvent(Integer.toString(i), Integer.toString(i));
        producer.send(new ProducerRecord<>("match-stream", Integer.toString(i), gson.toJson(match)));
      }
    } catch (Throwable throwable) {
      System.out.println("error");
    } finally {
      producer.close();
    }
  }
}
