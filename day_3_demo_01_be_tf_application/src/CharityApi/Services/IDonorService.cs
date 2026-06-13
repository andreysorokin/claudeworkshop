namespace CharityApi.Services;

using CharityApi.Models;

public interface IDonorService
{
    IEnumerable<Donor> GetAll();
    Donor? GetById(int id);
    Donor Create(CreateDonorRequest request);
    Donor? Update(int id, UpdateDonorRequest request);
    bool Delete(int id);

    /// <summary>Returns a page of donors. Page is 1-based.</summary>
    IEnumerable<Donor> GetPaged(int page, int pageSize);
}
