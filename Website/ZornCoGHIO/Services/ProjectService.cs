using Newtonsoft.Json;
using System.Net.Http;
using System.Threading.Tasks;
using Website.Json;

namespace ZornCoGHIO.Services
{
    public class ProjectService
    {
        private readonly HttpClient client;
        private Projects projects;
        private bool loaded = false;
        public async Task<Projects> AllProjects()
        {
            if (!loaded)
            {
                await LoadProjects();
                loaded = true;
            }
            return projects;
        }

        public ProjectService(HttpClient client)
        {
            this.client = client;
        }
        public async Task LoadProjects()
        {
            var task = await client.GetStringAsync("projects/project.json");
            Projects projects = JsonConvert.DeserializeObject<Projects>(task);
            this.projects = projects;
        }
    }
}
