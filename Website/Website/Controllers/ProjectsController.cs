using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Website.Json;

namespace Website.Controllers
{

    [Route("projects")]
    public class ProjectsController : Controller
    {
        private readonly Projects p;
        public ProjectsController(Projects p)
        {
            this.p = p;
        }

        [NonAction]
        private IActionResult GetProjectView(Project[] projects, string id)
        {
            var project = (from f in projects where f.Id == id select f).FirstOrDefault();
            if (project == null)
            {
                //TODO: Redirect to "project not found" page
                return RedirectToAction(actionName: nameof(Index));
            }
            return View("Project", project);
        }

        [Route("unreal/{id}")]
        public IActionResult Unreal(string id)
        {
            return GetProjectView(p.Unreal, id);
        }

        [Route("unity/{id}")]
        public IActionResult Unity(string id)
        {
            return GetProjectView(p.Unity, id);
        }

        [Route("minecraft/{id}")]
        public IActionResult Minecraft(string id)
        {
            return GetProjectView(p.Minecraft, id);
        }

        [Route("other/{id}")]
        public IActionResult Other(string id)
        {
            return GetProjectView(p.Other, id);
        }
    }
}
