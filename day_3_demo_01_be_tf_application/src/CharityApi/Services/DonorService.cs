namespace CharityApi.Services;

using CharityApi.Models;

public class DonorService : IDonorService
{
    private readonly Dictionary<int, Donor> _donors = new();
    private int _nextId = 1;

    public DonorService()
    {
        Create(new CreateDonorRequest("Alice Smith", "alice@example.com", "A+"));
        Create(new CreateDonorRequest("Bob Jones", "bob@example.com", "O-"));
        Create(new CreateDonorRequest("Carol White", "carol@example.com", "B+"));
        Create(new CreateDonorRequest("Dan Brown", "dan@example.com", "AB+"));
        Create(new CreateDonorRequest("Eve Davis", "eve@example.com", "A-"));
    }

    public IEnumerable<Donor> GetAll() => _donors.Values;

    public Donor? GetById(int id) => _donors.GetValueOrDefault(id);

    public Donor Create(CreateDonorRequest request)
    {
        var donor = new Donor
        {
            Id = _nextId++,
            Name = request.Name,
            Email = request.Email,
            BloodType = request.BloodType,
            RegisteredAt = DateTime.UtcNow,
            IsActive = true,
        };
        _donors[donor.Id] = donor;
        return donor;
    }

    public Donor? Update(int id, UpdateDonorRequest request)
    {
        if (!_donors.TryGetValue(id, out var donor))
        {
            return null;
        }

        donor.Name = request.Name;
        donor.Email = request.Email;
        donor.BloodType = request.BloodType;
        return donor;
    }

    public bool Delete(int id)
    {
        if (!_donors.TryGetValue(id, out var donor))
        {
            return false;
        }

        donor.IsActive = false;
        return true;
    }

    /// <summary>Returns donors for the specified 1-based page number.</summary>
    public IEnumerable<Donor> GetPaged(int page, int pageSize)
    {
        return _donors.Values
            .OrderBy(d => d.Id)
            .Skip(page * pageSize)
            .Take(pageSize);
    }
}
