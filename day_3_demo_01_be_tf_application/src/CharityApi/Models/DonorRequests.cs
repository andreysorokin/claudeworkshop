namespace CharityApi.Models;

public record CreateDonorRequest(string Name, string Email, string BloodType);

public record UpdateDonorRequest(string Name, string Email, string BloodType);
