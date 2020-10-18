using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting.Internal;
using Microsoft.Extensions.Logging;
using Website.Models;
using Website.Json;
using Newtonsoft.Json;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace Website.Controllers
{
    [Route("")]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IWebHostEnvironment _env;
        public static List<ProjectJson> projects;
        public HomeController(ILogger<HomeController> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _env = env;

            using (StreamReader sr = new StreamReader(Path.Combine(_env.WebRootPath, "projects/project.json")))
            {
                projects = JsonConvert.DeserializeObject<List<ProjectJson>>(sr.ReadToEnd());
            }
        }
        public IActionResult Index()
        {
            //ViewBag.Hello = "Hi!";
            return View();
        }

        [Route("project/{id}")]
        public IActionResult Project(string id)
        {
            var projectvar = from f in projects where f.Id == id select f;
            ProjectJson project = projectvar.FirstOrDefault();
            if (project == null)
            {
                //TODO: Redirect to "project not found" page
                return RedirectToAction(actionName: nameof(Index));
            }

            return View(project);
        }

        [Route("error")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
