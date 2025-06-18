import {mock, MockProxy} from 'jest-mock-extended'
import {when} from 'jest-when'
import ProjectRepository from '../../repositories/projectRepository/project.repository'
import ProjectService from '../../services/project.service'
import UserService from '../../services/user.service'
import { DesignationService } from '../../services/designation.service'
import ProjectUserRepository from '../../repositories/projectRepository/projectUser.repository'

describe('ProjectService',()=>{

    let MockProjectRepository:MockProxy<ProjectRepository>
    let MockUserService:MockProxy<UserService>
    let MockDesignationService:MockProxy<DesignationService>
    let MockProjectUserRepository:MockProxy<ProjectUserRepository>
    let projectService:ProjectService

    beforeEach(()=>{
        MockProjectRepository=mock<ProjectRepository>();
        MockUserService=mock<UserService>();
        MockDesignationService=mock<DesignationService>();
        MockProjectUserRepository=mock<ProjectUserRepository>();
        projectService=new ProjectService(MockProjectRepository,MockUserService,MockDesignationService,MockProjectUserRepository)
    })

    describe('assign engineer to project',() => {
        it('should assign the engineers to the specified project', async() => {
            const mockProject = { 
                id: 1, 
                project_id: "PRJ001",
                name: 'Test Project',
                startdate: new Date(),
                enddate: new Date(),
                status: 'In Progress',
                pm: { id: 1 },
                lead: { id: 2 }
            };
            const mockUser = { 
                id: 'KV001', // Changed to match the input format
                employee_id: 'EMP001',
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                department: { id: 1, name: 'Engineering' },
                designation: { id: 1, name: 'Software Engineer' },
                projectUsers: [],
                leadProjects: [],
                managedProjects: []
            };
            
            when(MockProjectRepository.findOneById).calledWith(1).mockResolvedValue(mockProject);
            when(MockUserService.getUserProjects).calledWith('KV001').mockResolvedValue(mockUser);
            when(MockUserService.getUserById).calledWith('KV001').mockResolvedValue(mockUser);
            when(MockDesignationService.getDesignationById).calledWith(1).mockResolvedValue({ id: 1, name: 'Software Engineer' });
            when(MockProjectRepository.saveProjectUsers).mockResolvedValue([]);
            
            await projectService.assignEngineerToProject(1, [{user_id: 'KV001', designation_id: 1}]);
            
            expect(MockProjectRepository.saveProjectUsers).toHaveBeenCalledWith([
                expect.objectContaining({
                    project: mockProject,
                    user: mockUser,
                    designation: { id: 1, name: 'Software Engineer' },
                    assigned_on: expect.any(Date)
                })
            ]);
        });

        it('should throw error when project not found', async() => {
            when(MockProjectRepository.findOneById).calledWith(1).mockResolvedValue(null);
            
            await expect(projectService.assignEngineerToProject(1, [{user_id: 'KV001', designation_id: 1}]))
                .rejects.toThrow('Project with ID 1 not found');
        });

        it('should throw error when user is already in max projects', async() => {
            const mockProject = { id: 1, name: 'Test Project' };
            const mockUser = { 
                id: 'KV001',
                employee_id: 'EMP001',
                projectUsers: [{}, {}], // Two existing project assignments
                leadProjects: [],
                managedProjects: []
            };
            
            when(MockProjectRepository.findOneById).calledWith(1).mockResolvedValue(mockProject);
            when(MockUserService.getUserProjects).calledWith('KV001').mockResolvedValue(mockUser);
            
            await expect(projectService.assignEngineerToProject(1, [{user_id: 'KV001', designation_id: 1}]))
                .rejects.toThrow('User with ID KV001 is already assigned in maximum mumber of projects');
        });
    });

    describe('remove engineer from project', () => {
        it('should remove engineers from the project', async() => {
            const mockAssignment = { 
                id: 1,
                project: {
                    id: 1,
                    project_id: "PRJ001",
                    name: "Test Project",
                    startdate: new Date(),
                    enddate: new Date(),
                    status: 'In Progress'
                },
                user: {
                    id: "user1",
                    employee_id: "EMP001",
                    first_name: "John",
                    last_name: "Doe"
                },
                designation: {
                    id: 1,
                    name: "Software Engineer"
                },
                assigned_on: new Date('2023-01-01'),
                end_date: null
            };
            
            when(MockProjectUserRepository.findUserAssignmentByProjectIdAndUserId)
                .calledWith('user1', 1)
                .mockResolvedValue(mockAssignment);
            
            await projectService.removeEngineerFromProject(1, ['user1']);
            
            expect(MockProjectUserRepository.update).toHaveBeenCalledWith({
                ...mockAssignment,
                end_date: expect.any(Date)
            });
        });

        it('should throw error when user assignment not found', async() => {
            when(MockProjectUserRepository.findUserAssignmentByProjectIdAndUserId)
                .calledWith('user1', 1)
                .mockResolvedValue(null);
            
            await expect(projectService.removeEngineerFromProject(1, ['KV001']))
                .rejects.toThrow('Failed to remove engineer from project: User assignment not found');
        });
    });

    
})