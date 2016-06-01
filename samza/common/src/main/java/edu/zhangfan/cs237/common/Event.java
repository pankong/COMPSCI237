package edu.zhangfan.cs237.common;


public class Event {

  private Integer blockId;
  private String identifier;
  private Integer longitude;
  private Integer latitude;
  private Status status;
  private Type type;

  public Event(Integer blockId, String identifier, Integer longitude, Integer latitude, Status status, Type type) {
    this.blockId = blockId;
    this.identifier = identifier;
    this.longitude = longitude;
    this.latitude = latitude;
    this.status = status;
    this.type = type;
  }

  public Integer getBlockId() {
    return blockId;
  }

  public void setBlockId(Integer blockId) {
    this.blockId = blockId;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public Integer getLongitude() {
    return longitude;
  }

  public void setLongitude(Integer longitude) {
    this.longitude = longitude;
  }

  public Integer getLatitude() {
    return latitude;
  }

  public void setLatitude(Integer latitude) {
    this.latitude = latitude;
  }

  public Status getStatus() {
    return status;
  }

  public void setStatus(Status status) {
    this.status = status;
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }
}
