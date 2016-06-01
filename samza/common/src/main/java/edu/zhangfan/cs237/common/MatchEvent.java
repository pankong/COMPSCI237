package edu.zhangfan.cs237.common;

public class MatchEvent {
  private String riderId;
  private String driverId;

  public MatchEvent(String riderId, String driverId) {
    this.riderId = riderId;
    this.driverId = driverId;
  }

  public String getRiderId() {
    return riderId;
  }

  public void setRiderId(String riderId) {
    this.riderId = riderId;
  }

  public String getDriverId() {
    return driverId;
  }

  public void setDriverId(String driverId) {
    this.driverId = driverId;
  }
}
